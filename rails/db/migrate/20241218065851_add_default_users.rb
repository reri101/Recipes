class AddDefaultUsers < ActiveRecord::Migration[6.0]
  def change
    User.create!(email: 'test@test.com', password: 'testtest', password_confirmation: 'testtest', name: "Nicholas", role: 'user') if User.find_by(email: 'test@test.com').nil?
    User.create!(email: 'test2@test.com', password: 'testtest', password_confirmation: 'testtest', name: "Marek", role: 'user') if User.find_by(email: 'test2@test.com').nil?
    User.create!(email: 'admin@admin.com', password: 'admin123', password_confirmation: 'admin123', name: "Admin", role: 'admin') if User.find_by(email: 'admin@admin.com').nil?
  end
end
