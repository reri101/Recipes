Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    resources :photos
    resources :categories
    resources :tags
    resources :ingredients
    resources :recipes
    resources :users
    devise_for :users
  end

end
