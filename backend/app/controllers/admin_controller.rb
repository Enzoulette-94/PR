class AdminController < ActionController::API
  # TEMPORAIRE: endpoint de seed production.
  # A SUPPRIMER après usage.
  # Exemple: curl -X POST "$BACKEND_URL/admin/seed" -H "X-ADMIN-TOKEN: $ADMIN_SEED_TOKEN"
  def seed
    provided_token = request.headers["X-ADMIN-TOKEN"]
    expected_token = ENV["ADMIN_SEED_TOKEN"]

    unless provided_token.present? && expected_token.present? &&
           ActiveSupport::SecurityUtils.secure_compare(provided_token, expected_token)
      render json: { error: "Unauthorized" }, status: :unauthorized
      return
    end

    Rails.application.load_seed
    render json: { status: "ok" }
  end
end
