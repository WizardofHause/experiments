Rails.application.routes.draw do
  get '/hello', to: 'application#hello_world'

  get '/auth/auth0/callback' => 'auth0#callback'
  get '/auth/failure' => 'auth0#failure'
  get '/auth/logout' => 'auth0#logout'
end
