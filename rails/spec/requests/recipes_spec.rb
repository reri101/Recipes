require 'rails_helper'

RSpec.describe "Recipes", type: :request do
  include_context "test_seed"

  def json_response
    JSON.parse(response.body)
  end

  describe "GET /recipes" do
    context "when user is logged-in" do

      it "Magda Gesler should see her recipes" do
        sign_in magda_gessler
        get recipes_path
        expect(response).to have_http_status(:ok)
        expect(json_response.map { |recipe| recipe["name"] }).to eq(["Chocolate Cake", "Apple Pie"])
      end

      it "Anna Kowalsa should see her recipes" do
        sign_in anna_kowalska
        get recipes_path
        expect(response).to have_http_status(:ok)
        expect(json_response.map { |recipe| recipe["name"] }).to eq(["Ciasto Czekoladowe", "Szarlotka"])
      end
    end

    context "when admin user" do
      before do
        sign_in gordon_ramsay
      end

      it "returns forbidden status" do
        get recipes_path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        get recipes_path
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /recipes/:id" do
    context "when logged-in user as Magda Gesler" do

      it "returns the requested recipe" do
        sign_in magda_gessler
        get recipe_path(chocolate_cake_recipe)
        expect(response).to have_http_status(:ok)
        expect(json_response["name"]).to eq("Chocolate Cake")
        expect(json_response["description"]).to eq("Delicious chocolate cake")
      end
    end

    context "when logged-in user as Anna Kowalsa" do

      it "returns the requested recipe" do
        sign_in anna_kowalska
        get recipe_path(ciasto_czekoladowe_recipe)
        expect(response).to have_http_status(:ok)
        expect(json_response["name"]).to eq("Ciasto Czekoladowe")
        expect(json_response["description"]).to eq("Pyszne ciasto czekoladowe")
      end
    end

    context "when admin user" do
      before do
        sign_in gordon_ramsay
      end

      it "returns forbidden status" do
        get recipe_path(chocolate_cake_recipe)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        get recipe_path(chocolate_cake_recipe)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /recipes" do
    context "when logged-in user" do

      it "creates a new recipe as Magda Gesler" do
        sign_in magda_gessler
        get recipes_path
        recipes_before = json_response.map { |recipe| recipe["name"] }
        expect(recipes_before).to eq(["Chocolate Cake", "Apple Pie"])

        sign_in magda_gessler
        expect {
          post recipes_path, params: {
            recipe: {
              name: "New Recipe",
              description: "Test recipe",
              preparation_time: 25,
              category_id: vegan_category.id
            }
          }
        }.to change(Recipe, :count).by(1)

        expect(response).to have_http_status(:created)

        sign_in magda_gessler
        get recipes_path
        recipes_after = json_response.map { |recipe| recipe["name"] }
        expect(recipes_after).to eq(["Chocolate Cake", "Apple Pie", "New Recipe"])
      end

      it "creates a new recipe as Anna Kowalska" do
        sign_in anna_kowalska
        get recipes_path
        recipes_before = json_response.map { |recipe| recipe["name"] }
        expect(recipes_before).to eq(["Ciasto Czekoladowe", "Szarlotka"])

        sign_in anna_kowalska
        expect {
          post recipes_path, params: {
            recipe: {
              name: "Nowy Przepis",
              description: "Opis",
              preparation_time: 25,
              category_id: wegetarianska_category.id
            }
          }
        }.to change(Recipe, :count).by(1)
        expect(response).to have_http_status(:created)

        sign_in anna_kowalska
        get recipes_path
        recipes_after = json_response.map { |recipe| recipe["name"] }.sort
        expect(recipes_after).to eq(["Ciasto Czekoladowe", "Nowy Przepis", "Szarlotka"])
      end
    end

    context "when admin user" do
      before do
        sign_in gordon_ramsay
      end

      it "returns forbidden status" do
        post recipes_path, params: {
          recipe: {
            name: "Admin Recipe",
            description: "Test recipe by admin",
            preparation_time: 20,
            category_id: vegan_category.id
          }
        }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        post recipes_path, params: {
          recipe: {
            name: "Guest Recipe",
            description: "Test recipe by guest",
            preparation_time: 15,
            category_id: vegan_category.id
          }
        }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PUT /recipes/:id" do
    context "when logged-in user" do
      it "updates the recipe as Magda Gesler" do
        sign_in magda_gessler
        get recipes_path
        recipes_before = json_response.map { |recipe| recipe["name"] }
        expect(recipes_before).to eq(["Chocolate Cake", "Apple Pie"])

        sign_in magda_gessler
        put recipe_path(chocolate_cake_recipe), params: {
          recipe: { name: "Updated Chocolate Cake" }
        }
        expect(response).to have_http_status(:ok)

        sign_in magda_gessler
        get recipes_path
        recipes_after = json_response.map { |recipe| recipe["name"] }.sort
        expect(recipes_after).to eq(["Apple Pie","Updated Chocolate Cake"])
      end

      it "updates the recipe as Anna Kowalska" do
        sign_in anna_kowalska
        get recipes_path
        recipes_before = json_response.map { |recipe| recipe["name"] }
        expect(recipes_before).to eq(["Ciasto Czekoladowe", "Szarlotka"])

        sign_in anna_kowalska
        put recipe_path(ciasto_czekoladowe_recipe), params: {
          recipe: { name: "Uaktualnione Ciasto Czekoladowe" }
        }
        expect(response).to have_http_status(:ok)

        sign_in anna_kowalska
        get recipes_path
        recipes_after = json_response.map { |recipe| recipe["name"] }.sort
        expect(recipes_after).to eq(["Szarlotka", "Uaktualnione Ciasto Czekoladowe"])
      end
    end

    context "when updating another user's recipe" do
      it "as Magda Gesler denies access" do
        sign_in magda_gessler
        put recipe_path(szarlotka_recipe), params: { recipe: { name: "Hacked Recipe" } }
        expect(response).to have_http_status(:forbidden)
      end

      it "as Anna Kowalska denies access" do
        sign_in anna_kowalska
        put recipe_path(apple_pie_recipe), params: { recipe: { name: "Hacked Recipe" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when admin user" do
      it "returns forbidden status" do
        sign_in gordon_ramsay
        put recipe_path(chocolate_cake_recipe), params: { recipe: { name: "Admin Update" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        put recipe_path(chocolate_cake_recipe), params: { recipe: { name: "Guest Update" } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /recipes/:id" do
    context "when logged-in user" do
      it "deletes the recipe as Magda Gesler" do
        sign_in magda_gessler
        get recipes_path
        recipes_before = json_response.map { |recipe| recipe["name"] }
        expect(recipes_before).to eq(["Chocolate Cake", "Apple Pie"])

        sign_in magda_gessler
        expect {
          delete recipe_path(chocolate_cake_recipe)
        }.to change(Recipe, :count).by(-1)
        expect(response).to have_http_status(:no_content)

        sign_in magda_gessler
        get recipes_path
        recipes_after = json_response.map { |recipe| recipe["name"] }
        expect(recipes_after).to eq([ "Apple Pie"])

      end

      it "deletes the recipe as Anna Kowalska" do
        sign_in anna_kowalska
        get recipes_path
        recipes_before = json_response.map { |recipe| recipe["name"] }
        expect(recipes_before).to eq(["Ciasto Czekoladowe", "Szarlotka"])

        sign_in anna_kowalska
        expect {
          delete recipe_path(ciasto_czekoladowe_recipe)
        }.to change(Recipe, :count).by(-1)
        expect(response).to have_http_status(:no_content)

        sign_in anna_kowalska
        get recipes_path
        recipes_after = json_response.map { |recipe| recipe["name"] }
        expect(recipes_after).to eq([ "Szarlotka"])
      end
    end

    context "when deleting another user's recipe" do
      it "as Magda Gesler denies access" do
        sign_in magda_gessler
        delete recipe_path(szarlotka_recipe)
        expect(response).to have_http_status(:forbidden)
      end

      it "as Anna Kowalska denies access" do
        sign_in anna_kowalska
        delete recipe_path(apple_pie_recipe)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when admin user" do
      before do
        sign_in gordon_ramsay
      end

      it "returns forbidden status" do
        delete recipe_path(chocolate_cake_recipe)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        delete recipe_path(chocolate_cake_recipe)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
