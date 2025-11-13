RSpec.shared_context "test_seed" do
  let!(:gordon_ramsay) { User.create!(name: "Gordon", surname: "Ramsay", email: "gordon@ramsay.com", password: "password123", role: "admin") }

  let!(:magda_gessler) { User.create!(name: "Magda", surname: "Gessler", email: "magda@gessler.com", password: "password123", role: "user") }
  let!(:vegan_category) { Category.create!(name: "Vegan", user: magda_gessler) }
  let!(:gluten_free_category) { Category.create!(name: "Gluten-Free", user: magda_gessler) }
  let!(:traditional_tag) { Tag.create!(name: "Traditional", user: magda_gessler) }
  let!(:modern_tag) { Tag.create!(name: "Modern", user: magda_gessler) }
  let!(:salt_ingredient) { Ingredient.create!(name: "Salt", unit: "g", user: magda_gessler) }
  let!(:sugar_ingredient) { Ingredient.create!(name: "Sugar", unit: "g", user: magda_gessler) }
  let!(:desserts_category) { Category.create!(name: "Desserts", user: magda_gessler) }
  let!(:chocolate_cake_recipe) { Recipe.create!(name: "Chocolate Cake", description: "Delicious chocolate cake", preparation_time: "30", user: magda_gessler, category: desserts_category) }
  let!(:apple_pie_recipe) { Recipe.create!(name: "Apple Pie", description: "Classic apple pie", preparation_time: "40", user: magda_gessler, category: vegan_category) }

  let!(:anna_kowalska) { User.create!(name: "Anna", surname: "Kowalska", email: "anna@kowalska.com", password: "password123", role: "user") }
  let!(:wegetarianska_category) { Category.create!(name: "Wegetariańska", user: anna_kowalska) }
  let!(:paleo_category) { Category.create!(name: "Paleo", user: anna_kowalska) }
  let!(:tradycyjna_tag) { Tag.create!(name: "Tradycyjna", user: anna_kowalska) }
  let!(:nowoczesna_tag) { Tag.create!(name: "Nowoczesna", user: anna_kowalska) }
  let!(:sol_ingredient) { Ingredient.create!(name: "Sól", unit: "g", user: anna_kowalska) }
  let!(:cukier_ingredient) { Ingredient.create!(name: "Cukier", unit: "g", user: anna_kowalska) }
  let!(:desery_category) { Category.create!(name: "Desery", user: anna_kowalska) }
  let!(:ciasto_czekoladowe_recipe) { Recipe.create!(name: "Ciasto Czekoladowe", description: "Pyszne ciasto czekoladowe", preparation_time: "30", user: anna_kowalska, category: desery_category) }
  let!(:szarlotka_recipe) { Recipe.create!(name: "Szarlotka", description: "Klasyczna szarlotka", preparation_time: "40", user: anna_kowalska, category: wegetarianska_category) }
end
