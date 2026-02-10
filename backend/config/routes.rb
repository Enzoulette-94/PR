Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "/people", to: "people#index"
  get "/people/:slug", to: "people#show"

  get "/people/:slug/goals", to: "goals#index"
  patch "/goals/:id", to: "goals#update"

  get "/people/:slug/personal_records", to: "personal_records#index"
  post "/people/:slug/personal_records", to: "personal_records#create"
  patch "/personal_records/:id", to: "personal_records#update"
  delete "/personal_records/:id", to: "personal_records#destroy"

  get "/stats/goals", to: "stats#goals"
end
