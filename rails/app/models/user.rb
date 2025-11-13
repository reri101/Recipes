# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  jti                    :string           not null
#  name                   :string           not null
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  role                   :string           not null
#  surname                :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  photo_id               :bigint
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_jti                   (jti) UNIQUE
#  index_users_on_photo_id              (photo_id)
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (photo_id => photos.id)
#
class User < ApplicationRecord
  has_many :recipes, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :tags, dependent: :destroy
  has_many :ingredients, dependent: :destroy
  belongs_to :photo, optional: true

  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :jwt_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         jwt_revocation_strategy: self

  enum role: { user: 'user', admin: 'admin' }

  
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :role, presence: true, inclusion: { in: roles.keys }
  validates :surname, allow_blank: true, length: { maximum: 255 }
  
  def admin?
    role == "admin"
  end

  def user?
    role == "user"
  end
end
