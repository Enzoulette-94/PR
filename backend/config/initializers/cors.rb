# Be sure to restart your server when you modify this file.

allowed_origins = if Rails.env.production?
  [ENV["FRONTEND_ORIGIN"]].compact
else
  ["http://localhost:5173"]
end.reject(&:blank?).uniq

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*allowed_origins)

    resource "*",
      headers: :any,
      methods: %i[get post patch put delete options head],
      expose: %w[X-Request-Id]
  end
end
