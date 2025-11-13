# == Schema Information
#
# Table name: photos
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Photo < ApplicationRecord
    has_one_attached :file_data
    validates :file_data, attached: true, content_type: ['image/png', 'image/jpg', 'image/jpeg']
    has_one :categories

    def file_url
        Rails.application.routes.url_helpers.rails_blob_url(file_data, only_path: false) if file_data.attached?
    end

    validates :file_data, presence: true
end