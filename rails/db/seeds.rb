# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

if User.find_by(email: 'test@test.com').nil?
    User.create!(email: 'test@test.com', password: 'testtest', password_confirmation: 'testtest', name: "Nicholas", role: 'user')
end

if User.find_by(email: 'admin@admin.com').nil?
    User.create!(email: 'admin@admin.com', password: 'admin123', password_confirmation: 'admin123', name: "Admin", role: 'admin')
end
