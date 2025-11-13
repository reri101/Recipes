# == Schema Information
#
# Table name: recipes
#
#  id               :bigint           not null, primary key
#  description      :string           not null
#  name             :string           not null
#  preparation_time :integer          not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  category_id      :bigint           not null
#  photo_id         :bigint
#  user_id          :bigint           default(1), not null
#
# Indexes
#
#  index_recipes_on_category_id  (category_id)
#  index_recipes_on_photo_id     (photo_id)
#  index_recipes_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (photo_id => photos.id)
#  fk_rails_...  (user_id => users.id)
#
class Recipe < ApplicationRecord
  belongs_to :user
  belongs_to :photo, optional: true
  belongs_to :category
  has_and_belongs_to_many :tags
  has_many :recipes_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipes_ingredients

  accepts_nested_attributes_for :recipes_ingredients, allow_destroy: true

  validates :name, presence: true, length: { maximum: 255 }
  validates :description, presence: true, length: { maximum: 500 }
  validates :preparation_time, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :user_id, presence: true
  validates :category_id, presence: true
end
