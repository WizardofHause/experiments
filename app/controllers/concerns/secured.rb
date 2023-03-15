# ./app/controllers/concerns/secured.rb

# Access the user from the session with `session[:userinfo]`
# Use in any controller that requires a logged in user. 
module Secured
    extend ActiveSupport::Concern
  
    included do
      before_action :logged_in_using_omniauth?
    end
  
    def logged_in_using_omniauth?
      redirect_to '/' unless session[:userinfo].present?
    end
end
