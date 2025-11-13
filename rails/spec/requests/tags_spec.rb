require 'rails_helper'

RSpec.describe "Tags", type: :request do
  include_context "test_seed"

  def json_response
    JSON.parse(response.body)
  end

  describe "GET /tags" do
    context "when user is logged-in user" do

      it "Magda Gesler should see her tags" do
        sign_in magda_gessler
        get tags_path
        expect(response).to have_http_status(:ok)
        expect(json_response.map { |tag| tag["name"] }).to eq(["Traditional", "Modern"])
      end

      it "Anna Kowalsa should see her tags" do
        sign_in anna_kowalska
        get tags_path
        expect(response).to have_http_status(:ok)
        expect(json_response.map { |tag| tag["name"] }).to eq(["Tradycyjna", "Nowoczesna"])
      end
    end

    context "when admin user" do
      it "returns forbidden response" do
        sign_in gordon_ramsay
        get tags_path
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        get tags_path
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /tags/:id" do
    context "when logged-in user as Magda Geseler" do
      before do
        sign_in magda_gessler
      end

      it "returns the requested tag" do
        get tag_path(traditional_tag)
        expect(response).to have_http_status(:ok)
        expect(json_response["name"]).to eq("Traditional")
      end
    end

    context "when logged-in user as Anna Kowalsa" do
      before do
        sign_in anna_kowalska
      end

      it "returns the requested tag" do
        get tag_path(tradycyjna_tag)
        expect(response).to have_http_status(:ok)
        expect(json_response["name"]).to eq("Tradycyjna")
      end
    end

    context "when admin user" do
      it "returns forbidden status" do
        sign_in gordon_ramsay
        get tag_path(traditional_tag)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        get tag_path(traditional_tag)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /tags" do
    context "when logged-in user" do
      it "creates a new tag for the user as Magda Gesler" do
        sign_in magda_gessler
        get tags_path
        tags_before = json_response.map { |tag| tag["name"] }
        expect(tags_before).to eq(["Traditional","Modern"])


        sign_in magda_gessler
        expect {
          post tags_path, params: { tag: { name: "Healthy" } }
        }.to change(Tag, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(json_response["name"]).to eq("Healthy")

        sign_in magda_gessler
        get tags_path
        tags_after = json_response.map { |tag| tag["name"] }
        expect(tags_after).to eq(["Traditional","Modern","Healthy"])
      end

      it "creates a new tag for the user as Anna Kowalsa" do
        sign_in anna_kowalska
        get tags_path
        tags_before = json_response.map { |tag| tag["name"] }
        expect(tags_before).to eq(["Tradycyjna","Nowoczesna"])


        sign_in anna_kowalska
        expect {
          post tags_path, params: { tag: { name: "Zdrowa" } }
        }.to change(Tag, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(json_response["name"]).to eq("Zdrowa")

        sign_in anna_kowalska
        get tags_path
        tags_after = json_response.map { |tag| tag["name"] }
        expect(tags_after).to eq(["Tradycyjna","Nowoczesna","Zdrowa"])
      end
    end

    context "when admin user" do
      it "returns forbidden status" do
        sign_in gordon_ramsay
        post tags_path, params: { tag: { name: "Healthy" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        post tags_path, params: { tag: { name: "Healthy" } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PUT /tags/:id" do
    context "when updating own tag" do
      it "updates the tag as Magda Gesler" do
        sign_in magda_gessler
        get tags_path
        tags_before = json_response.map { |tag| tag["name"] }
        expect(tags_before).to eq(["Traditional","Modern"])

        sign_in magda_gessler
        put tag_path(traditional_tag), params: { tag: { name: "Updated Tag" } }
        expect(response).to have_http_status(:ok)

        sign_in magda_gessler
        get tags_path
        tags_after = json_response.map { |tag| tag["name"] }.sort
        expect(tags_after).to eq(["Modern","Updated Tag"])
      end

      it "updates the tag as Anna Kowalska" do
        sign_in anna_kowalska
        get tags_path
        tags_before = json_response.map { |tag| tag["name"] }
        expect(tags_before).to eq(["Tradycyjna","Nowoczesna"])

        sign_in anna_kowalska
        put tag_path(tradycyjna_tag), params: { tag: { name: "Uaktualniony Tag" } }
        expect(response).to have_http_status(:ok)

        sign_in anna_kowalska
        get tags_path
        tags_after = json_response.map { |tag| tag["name"] }.sort
        expect(tags_after).to eq(["Nowoczesna","Uaktualniony Tag"])
      end
    end

    context "when updating another user's tag" do
      it "as Magda Gesler denies access" do
        sign_in magda_gessler
        put tag_path(tradycyjna_tag), params: { tag: { name: "Hacked Tag" } }
        expect(response).to have_http_status(:forbidden)
      end

      it "as Anna Kowalska denies access" do
        sign_in anna_kowalska
        put tag_path(traditional_tag), params: { tag: { name: "Hacked Tag" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when admin user" do
      before do
        sign_in gordon_ramsay
      end

      it "returns forbidden status" do
        put tag_path(tradycyjna_tag), params: { tag: { name: "Updated by Admin" } }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        put tag_path(tradycyjna_tag), params: { tag: { name: "Updated Tag" } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /tags/:id" do
    context "when deleting own tag" do
      it "deletes the tag as Magda Gesler" do
        sign_in magda_gessler
        get tags_path
        tags_before = json_response.map { |tag| tag["name"] }
        expect(tags_before).to eq(["Traditional","Modern"])

        sign_in magda_gessler
        delete tag_path(traditional_tag)
        expect(response).to have_http_status(:no_content)

        sign_in magda_gessler
        get tags_path
        tags_after = json_response.map { |tag| tag["name"] }
        expect(tags_after).to eq(["Modern"])
      end

      it "deletes the tag as Anna Kowalska" do
        sign_in anna_kowalska
        get tags_path
        tags_before = json_response.map { |tag| tag["name"] }
        expect(tags_before).to eq(["Tradycyjna","Nowoczesna"])

        sign_in anna_kowalska
        delete tag_path(tradycyjna_tag)
        expect(response).to have_http_status(:no_content)

        sign_in anna_kowalska
        get tags_path
        tags_after = json_response.map { |tag| tag["name"] }
        expect(tags_after).to eq(["Nowoczesna"])
      end
    end

    context "when deleting another user's tag" do
      it "as Magda Gesler denies access" do
        sign_in magda_gessler
        delete tag_path(tradycyjna_tag)
        expect(response).to have_http_status(:forbidden)
      end

      it "as Magda Gesler denies access" do
        sign_in anna_kowalska
        delete tag_path(traditional_tag)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when admin user" do
      before do
        sign_in gordon_ramsay
      end

      it "returns forbidden status" do
        delete tag_path(tradycyjna_tag)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context "when not logged-in user" do
      it "returns unauthorized status" do
        delete tag_path(tradycyjna_tag)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
