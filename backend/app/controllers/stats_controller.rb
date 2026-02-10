class StatsController < ApplicationController
  def goals
    total = Goal.count
    completed = Goal.where(completed: true).count

    render json: { completed: completed, total: total }
  end
end
