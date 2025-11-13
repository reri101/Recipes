require 'rails_helper'

RSpec.describe "Categories", type: :request do
  include_context "test_seed"

  def json_response
    JSON.parse(response.body)
  end

  describe "GET /categories" do
    context "when user is logged-in" do
      it "Magda Gessler should see her categories" do
        sign_in magda_gessler
        get categories_path
        expect(response).to have_http_status(:ok)
        expect(json_response.map { |category| category["name"] }).to eq(["Vegan", "Gluten-Free", "Desserts"])
      end

      it "Anna Kowalska should see her categories" do
        sign_in anna_kowalska
        get categories_path
        expect(response).to have_http_status(:ok)
        expect(json_response.map { |category| category["name"] }).to eq(["Wegetariańska", "Paleo", "Desery"])
      end
    end



    context "when admin user" do

      it "returns forbidden status" do
        sign_in gordon_ramsay
        get categories_path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        get categories_path
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /categories" do
    context "when logged-in user" do

      it "creates a new category for the user as Magda Gesler" do
        sign_in magda_gessler
        get categories_path
        categories_before = json_response.map { |category| category["name"] }
        expect(categories_before).to eq(["Vegan", "Gluten-Free", "Desserts"])

        sign_in magda_gessler
        expect {
          post categories_path, params: { category: { name: "New Category" } }
        }.to change(Category, :count).by(1)
        expect(response).to have_http_status(:created)

        sign_in magda_gessler
        get categories_path
        categories_after = json_response.map { |category| category["name"] }.sort
        expect(categories_after).to eq(["Desserts", "Gluten-Free", "New Category", "Vegan"])
      end

      it "creates a new category for the user as Anna Kowalsa" do
        sign_in anna_kowalska
        get categories_path
        categories_before = json_response.map { |category| category["name"] }
        expect(categories_before).to eq(["Wegetariańska", "Paleo", "Desery"])

        sign_in anna_kowalska
        expect {
          post categories_path, params: { category: { name: "Nowa Kategoria" } }
        }.to change(Category, :count).by(1)
        expect(response).to have_http_status(:created)

        sign_in anna_kowalska
        get categories_path
        categories_after = json_response.map { |category| category["name"] }.sort
        expect(categories_after).to eq(["Desery", "Nowa Kategoria", "Paleo", "Wegetariańska"])
      end
    end

    context "when admin user" do

      it "returns forbidden status" do
        sign_in gordon_ramsay
        post categories_path, params: { category: { name: "Organic" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        post categories_path, params: { category: { name: "Gluten-Free" } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PUT /categories/:id" do
    context "when updating own category" do

      it "updates the category as Magda Gesler" do
        sign_in magda_gessler
        get categories_path
        categories_before = json_response.map { |category| category["name"] }
        expect(categories_before).to eq(["Vegan", "Gluten-Free", "Desserts"])

        sign_in magda_gessler
        put category_path(vegan_category), params: { category: { name: "Updated Category" } }
        expect(response).to have_http_status(:ok)

        sign_in magda_gessler
        get categories_path
        categories_after = json_response.map { |category| category["name"] }.sort
        expect(categories_after).to eq(["Desserts", "Gluten-Free", "Updated Category"])

      end

      it "updates the category as Anna Kowalska" do
        sign_in anna_kowalska
        get categories_path
        categories_before = json_response.map { |category| category["name"] }
        expect(categories_before).to eq(["Wegetariańska", "Paleo", "Desery"])

        sign_in anna_kowalska
        put category_path(wegetarianska_category), params: { category: { name: "Uaktualniona Kategoria" } }
        expect(response).to have_http_status(:ok)

        sign_in anna_kowalska
        get categories_path
        categories_after = json_response.map { |category| category["name"] }.sort
        expect(categories_after).to eq(["Desery", "Paleo", "Uaktualniona Kategoria"])
      end
    end

    context "when updating another user's category" do
      it "as Magda Gesler denies access" do
        sign_in magda_gessler
        put category_path(wegetarianska_category), params: { category: { name: "Hacked Category" } }
        expect(response).to have_http_status(:forbidden)
      end

      it "as Anna Kowalska denies access" do
        sign_in anna_kowalska
        put category_path(vegan_category), params: { category: { name: "Hacked Category" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when admin user" do
      before do
        sign_in gordon_ramsay
      end
      it "returns forbidden status" do
        put category_path(wegetarianska_category), params: { category: { name: "Updated by Admin" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        put category_path(vegan_category), params: { category: { name: "Updated Category" } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /categories/:id" do
    context "when deleting own category" do
      it "deletes the category if not used in a recipe as Magda Gesler" do
        sign_in magda_gessler
        get categories_path
        categories_before = json_response.map { |category| category["name"] }
        expect(categories_before).to eq(["Vegan", "Gluten-Free", "Desserts"])

        sign_in magda_gessler
        delete category_path(gluten_free_category)
        expect(response).to have_http_status(:no_content)

        sign_in magda_gessler
        get categories_path
        categories_after = json_response.map { |category| category["name"] }
        expect(categories_after).to eq(["Vegan", "Desserts"])
      end

      it "does not delete the category if used in a recipe as Magda Gesler" do
        sign_in magda_gessler
        get categories_path
        categories_before = json_response.map { |category| category["name"] }
        expect(categories_before).to eq(["Vegan", "Gluten-Free", "Desserts"])

        sign_in magda_gessler
        delete category_path(desserts_category)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(Category.exists?(desserts_category.id)).to be_truthy

        sign_in magda_gessler
        get categories_path
        categories_after = json_response.map { |category| category["name"] }
        expect(categories_after).to eq(["Vegan", "Gluten-Free", "Desserts"])
      end

      it "deletes the category if not used in a recipe as Anna Kowalska" do
        sign_in anna_kowalska
        get categories_path
        categories_before = json_response.map { |category| category["name"] }
        expect(categories_before).to eq(["Wegetariańska", "Paleo", "Desery"])

        sign_in anna_kowalska
        delete category_path(paleo_category)
        expect(response).to have_http_status(:no_content)

        sign_in anna_kowalska
        get categories_path
        categories_after = json_response.map { |category| category["name"] }
        expect(categories_after).to eq(["Wegetariańska", "Desery"])
      end

      it "does not delete the category if used in a recipe as Anna Kowalska" do
        sign_in anna_kowalska
        get categories_path
        categories_before = json_response.map { |category| category["name"] }
        expect(categories_before).to eq(["Wegetariańska", "Paleo", "Desery"])

        sign_in anna_kowalska
        delete category_path(desery_category)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(Category.exists?(desery_category.id)).to be_truthy

        sign_in anna_kowalska
        get categories_path
        categories_after = json_response.map { |category| category["name"] }
        expect(categories_after).to eq(["Wegetariańska", "Paleo", "Desery"])
      end
    end

    context "when deleting another user's category" do
      it "as Magda Gesler denies access" do
        sign_in magda_gessler
        delete category_path(wegetarianska_category)
        expect(response).to have_http_status(:forbidden)
      end

      it "as Anna Kowalska denies access" do
        sign_in anna_kowalska
        delete category_path(vegan_category)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when admin user" do
      before do
        sign_in gordon_ramsay
      end
      it "returns forbidden status" do
        delete category_path(wegetarianska_category)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        delete category_path(wegetarianska_category)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
