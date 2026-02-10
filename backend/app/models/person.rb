class Person < ApplicationRecord
  has_many :goals, -> { order(:position, :id) }, dependent: :destroy
  has_many :personal_records, -> { order(performed_on: :desc, created_at: :desc) }, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :slug, presence: true, uniqueness: true
end
