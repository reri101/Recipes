# == Schema Information
#
# Table name: categories
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  photo_id   :bigint
#  user_id    :bigint           default(1), not null
#
# Indexes
#
#  index_categories_on_photo_id  (photo_id)
#  index_categories_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (photo_id => photos.id)
#  fk_rails_...  (user_id => users.id)
#
class Category < ApplicationRecord
  belongs_to :user
  belongs_to :photo, optional: true, dependent: :destroy
  has_many :recipes, dependent: :restrict_with_error

  validates :name, presence: true, length: { maximum: 255 }
  validates :user_id, presence: true
end
