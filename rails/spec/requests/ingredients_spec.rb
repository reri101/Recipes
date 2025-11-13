require 'rails_helper'

RSpec.describe "Ingredients", type: :request do
  include_context "test_seed"

  def json_response
    JSON.parse(response.body)
  end

  describe "GET /ingredients" do
    context "when user is logged-in  as Magda Gesler" do

      it "Magda Gesler should see her ingredients" do
        sign_in magda_gessler
        get ingredients_path
        expect(response).to have_http_status(:ok)
        expect(json_response.map { |ingredient| ingredient["name"] }).to eq(["Salt","Sugar"])
      end

      it "Anna Kowalsa should see her ingredients" do
        sign_in anna_kowalska
        get ingredients_path
        expect(response).to have_http_status(:ok)
        expect(json_response.map { |ingredient| ingredient["name"] }).to eq(["Sól","Cukier"])
      end
    end

    context "when admin user" do
      it "returns forbidden status" do
        sign_in gordon_ramsay
        get ingredients_path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        get ingredients_path
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /ingredients" do
    context "when logged-in user" do
      it "creates a new ingredient for the user as Magda Gesler" do
        sign_in magda_gessler
        get ingredients_path
        ingredients_before = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_before).to eq(["Salt","Sugar"])

        sign_in magda_gessler
        expect {
          post ingredients_path, params: { ingredient: { name: "Olive Oil", unit: "ml", photo_id: nil } }
        }.to change(Ingredient, :count).by(1)

        expect(response).to have_http_status(:created)

        sign_in magda_gessler
        get ingredients_path
        ingredients_after = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_after).to eq(["Salt","Sugar", "Olive Oil"])
      end

      it "creates a new ingredient for the user as Anna Kowalsa" do
        sign_in anna_kowalska
        get ingredients_path
        ingredients_before = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_before).to eq(["Sól","Cukier"])

        sign_in anna_kowalska
        expect {
          post ingredients_path, params: { ingredient: { name: "Oliwa z oliwek", unit: "ml", photo_id: nil } }
        }.to change(Ingredient, :count).by(1)

        expect(response).to have_http_status(:created)

        sign_in anna_kowalska
        get ingredients_path
        ingredients_after = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_after).to eq(["Sól","Cukier", "Oliwa z oliwek"])
      end
    end

    context "when admin user" do

      it "returns forbidden status" do
        sign_in gordon_ramsay
        post ingredients_path, params: { ingredient: { name: "Olive Oil", unit: "ml", photo_id: nil } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        post ingredients_path, params: { ingredient: { name: "Olive Oil", unit: "ml", photo_id: nil } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PUT /ingredients/:id" do
    context "when updating own ingredient" do
      it "updates the ingredient as Magda Gesler" do
        sign_in magda_gessler
        get ingredients_path
        ingredients_before = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_before).to eq(["Salt","Sugar"])

        sign_in magda_gessler
        put ingredient_path(salt_ingredient), params: { ingredient: {name: "Updated Ingredient" } }
        expect(response).to have_http_status(:ok)

        sign_in magda_gessler
        get ingredients_path
        ingredients_after = json_response.map { |ingredient| ingredient["name"] }.sort
        expect(ingredients_after).to eq(["Sugar", "Updated Ingredient"])
      end

      it "updates the ingredient as Anna Kowalska" do
        sign_in anna_kowalska
        get ingredients_path
        ingredients_before = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_before).to eq(["Sól","Cukier"])

        sign_in anna_kowalska
        put ingredient_path(sol_ingredient), params: { ingredient: {name: "Uaktualniony Składnik" } }
        expect(response).to have_http_status(:ok)

        sign_in anna_kowalska
        get ingredients_path
        ingredients_after = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_after).to eq(["Uaktualniony Składnik","Cukier"])
      end
    end

    context "when updating another user's ingredient" do
      it "as Magda Gesler denies access" do
        sign_in magda_gessler
        put ingredient_path(sol_ingredient), params: { ingredient: { name: "Hacked Ingredient" } }
        expect(response).to have_http_status(:forbidden)
      end

      it "as Anna Kowalska denies access" do
        sign_in anna_kowalska
        put ingredient_path(salt_ingredient), params: { ingredient: { name: "Hacked Ingredient" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when admin user" do
      before do
        sign_in gordon_ramsay
      end

      it "returns forbidden status" do
        put ingredient_path(sol_ingredient), params: { ingredient: { name: "Updated by Admin" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        put ingredient_path(sol_ingredient), params: { ingredient: { name: "Updated Ingredient" } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /ingredients/:id" do
    context "when deleting own ingredient" do
      it "deletes the ingredient as Magda Gesler" do
        sign_in magda_gessler
        get ingredients_path
        ingredients_before = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_before).to eq(["Salt","Sugar"])

        sign_in magda_gessler
        delete ingredient_path(salt_ingredient)
        expect(response).to have_http_status(:no_content)

        sign_in magda_gessler
        get ingredients_path
        ingredients_after = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_after).to eq(["Sugar"])
      end

      it "deletes the ingredient as Anna Kowalska" do
        sign_in anna_kowalska
        get ingredients_path
        ingredients_before = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_before).to eq(["Sól","Cukier"])

        sign_in anna_kowalska
        delete ingredient_path(sol_ingredient)
        expect(response).to have_http_status(:no_content)

        sign_in anna_kowalska
        get ingredients_path
        ingredients_after = json_response.map { |ingredient| ingredient["name"] }
        expect(ingredients_after).to eq(["Cukier"])
      end
    end

    context "when deleting another user's ingredient" do
      it "as Magda Gesler denies access" do
        sign_in magda_gessler
        delete ingredient_path(sol_ingredient)
        expect(response).to have_http_status(:forbidden)
      end

      it "as Anna Kowalska denies access" do
        sign_in anna_kowalska
        delete ingredient_path(salt_ingredient)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when admin user" do
      before do
        sign_in gordon_ramsay
      end

      it "returns forbidden status" do
        delete ingredient_path(sol_ingredient)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        delete ingredient_path(sol_ingredient)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
