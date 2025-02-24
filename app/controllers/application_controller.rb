# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  # Código adicional, se necessário
end

# Depois
#before_action :authenticate_user!
# No controlador
# No controlador
def index
  @posts = Post.all
end

