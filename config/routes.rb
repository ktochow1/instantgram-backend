Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :posts, only: [:index, :create, :edit, :update]
    end
  end
  # namespace :api do
  #   namespace :v1 do
  #     resources :comments, only: [:index, :show, :create, :edit, :update, :delete]
  #   end
  # end
  # namespace :api do
  #   namespace :v1 do
  #     resources :likes, only: [:index, :show, :delete, :edit, :update, :create]
  #   end
  # end
end
