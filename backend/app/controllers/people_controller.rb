class PeopleController < ApplicationController
  def index
    people = Person.order(:name)
    render json: people.as_json(only: %i[name slug])
  end

  def show
    person = Person.find_by!(slug: params[:slug])
    render json: person.as_json(only: %i[name slug description])
  end
end
