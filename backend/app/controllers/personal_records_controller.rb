require "digest"

class PersonalRecordsController < ApplicationController
  before_action :require_write_password, only: %i[create update destroy]

  def index
    person = Person.find_by!(slug: params[:slug])
    records = person.personal_records.order(performed_on: :desc, created_at: :desc)
    render json: records.as_json(only: %i[id category performed_on description])
  end

  def create
    person = Person.find_by!(slug: params[:slug])
    record = person.personal_records.new(record_params)

    if record.save
      render json: record.as_json(only: %i[id category performed_on description]), status: :created
    else
      render_validation_errors(record)
    end
  end

  def update
    record = PersonalRecord.find(params[:id])

    if record.update(record_params)
      render json: record.as_json(only: %i[id category performed_on description])
    else
      render_validation_errors(record)
    end
  end

  def destroy
    record = PersonalRecord.find(params[:id])
    record.destroy!
    render json: { message: "Personal record deleted." }
  end

  private

  def record_params
    params.require(:personal_record).permit(:category, :performed_on, :description)
  end

  def require_write_password
    configured_password = ENV["GOGOLISTAN_WRITE_PASSWORD"]
    provided_password = request.headers["X-WRITE-PASSWORD"]

    if configured_password.blank?
      render json: { error: "Server write password is not configured." }, status: :internal_server_error
      return
    end

    provided_digest = Digest::SHA256.hexdigest(provided_password.to_s)
    configured_digest = Digest::SHA256.hexdigest(configured_password.to_s)

    return if ActiveSupport::SecurityUtils.secure_compare(provided_digest, configured_digest)

    render json: { error: "Invalid write password." }, status: :unauthorized
  end
end
