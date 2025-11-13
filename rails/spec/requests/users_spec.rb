require 'rails_helper'

RSpec.describe "Users", type: :request do
  include_context "test_seed"

  def json_response
    JSON.parse(response.body)
  end

  describe "GET /users" do
    context "when admin user" do
      it "returns all users" do
        sign_in gordon_ramsay
        get users_path
        expect(response).to have_http_status(:ok)
        expect(json_response.map { |u| u["id"] }).to match_array(User.pluck(:id))
      end
    end

    context "when regular user as Magda Gesler" do
      it "returns forbidden status" do
        sign_in magda_gessler
        get users_path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when regular user as Anna Kowalsa" do
      it "returns forbidden status" do
        sign_in anna_kowalska
        get users_path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        get users_path
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /users/:id" do
    context "when admin user" do
      it "returns the user details" do
        sign_in gordon_ramsay
        get user_path(magda_gessler)
        expect(response).to have_http_status(:ok)
        expect(json_response["id"]).to eq(magda_gessler.id)
      end
    end

    context "when regular user as Magda Gesler" do
      it "returns forbidden status" do
        sign_in magda_gessler
        get user_path(gordon_ramsay)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when regular user as Anna Kowalsa" do
      it "returns forbidden status" do
        sign_in anna_kowalska
        get user_path(gordon_ramsay)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        get user_path(gordon_ramsay)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /users" do
    context "when admin user" do
      it "creates a new user" do
        sign_in gordon_ramsay
        get users_path
        users_before = json_response.map { |u| u["name"] +" "+ u["surname"] }.compact
        expect(users_before).to eq(["Gordon Ramsay","Magda Gessler", "Anna Kowalska"])

        sign_in gordon_ramsay
        expect {
          post users_path, params: { user: { name: "New", surname: "User", email: "new.user@example.com", role: "user", password: "password" } }
        }.to change(User, :count).by(1)
        expect(response).to have_http_status(:created)

        sign_in gordon_ramsay
        get users_path
        users_after = json_response.map { |u| u["name"] +" "+ u["surname"] }.compact
        expect(users_after).to eq(["Gordon Ramsay","Magda Gessler", "Anna Kowalska","New User"])
      end
    end

    context "when regular user" do
      it "returns forbidden status" do
        sign_in magda_gessler
        post users_path, params: { user: { name: "New", surname: "User", email: "new.user@example.com", role: "user", password: "password" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        post users_path, params: { user: { name: "New", surname: "User", email: "new.user@example.com", role: "user", password: "password" } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PUT /users/:id" do
    context "when admin user" do
      it "updates the user details" do
        sign_in gordon_ramsay
        get user_path(magda_gessler)
        user_before = json_response["name"]
        expect(user_before).to eq("Magda")

        sign_in gordon_ramsay
        put user_path(magda_gessler), params: { user: { name: "Updated Name" } }
        expect(response).to have_http_status(:ok)

        sign_in gordon_ramsay
        get users_path
        users_after = json_response.map { |u| u["name"] +" "+ u["surname"] }.sort
        expect(users_after).to eq(["Anna Kowalska","Gordon Ramsay","Updated Name Gessler" ])

      end
    end

    context "when regular user" do
      it "returns forbidden status" do
        sign_in anna_kowalska
        put user_path(gordon_ramsay), params: { user: { name: "Hacked Name" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        put user_path(gordon_ramsay), params: { user: { name: "Hacked Name" } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /users/:id" do
    context "when admin user" do
      it "deletes the user" do
        sign_in gordon_ramsay
        get users_path
        users_before = json_response.map { |u| u["name"] + " " + u["surname"] }.compact
        expect(users_before).to eq(["Gordon Ramsay","Magda Gessler", "Anna Kowalska"])

        sign_in gordon_ramsay
        delete user_path(magda_gessler)
        expect(response).to have_http_status(:no_content)

        sign_in gordon_ramsay
        get users_path
        users_after = json_response.map { |u| u["name"] + " " + u["surname"] }.compact
        expect(users_after).to eq(["Gordon Ramsay", "Anna Kowalska"])
      end

      it "cannot delete itself" do
        sign_in gordon_ramsay
        delete user_path(gordon_ramsay)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when regular user" do
      it "returns forbidden status" do
        sign_in magda_gessler
        delete user_path(gordon_ramsay)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        delete user_path(gordon_ramsay)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
