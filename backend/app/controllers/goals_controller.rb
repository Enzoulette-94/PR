class GoalsController < ApplicationController
  def index
    person = Person.find_by!(slug: params[:slug])
    render json: person.goals.as_json(only: %i[id title completed position])
  end

  def update
    goal = Goal.find(params[:id])

    if goal.update(goal_params)
      render json: goal.as_json(only: %i[id title completed position])
    else
      render_validation_errors(goal)
    end
  end

  private

  def goal_params
    return params.require(:goal).permit(:completed) if params[:goal].present?

    params.permit(:completed)
  end
end
