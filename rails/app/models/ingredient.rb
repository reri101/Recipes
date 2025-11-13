# == Schema Information
#
# Table name: ingredients
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  unit       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  photo_id   :bigint
#  user_id    :bigint           default(1), not null
#
# Indexes
#
#  index_ingredients_on_photo_id  (photo_id)
#  index_ingredients_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (photo_id => photos.id)
#  fk_rails_...  (user_id => users.id)
#
class Ingredient < ApplicationRecord
  belongs_to :user
  belongs_to :photo, optional: true
  has_many :recipes_ingredients, dependent: :destroy
  has_many :recipes, through: :recipes_ingredients

  validates :name, presence: true, length: { maximum: 255 }
  validates :unit, presence: true, length: { maximum: 50 }
  validates :user_id, presence: true
end
