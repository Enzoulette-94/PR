class PersonalRecord < ApplicationRecord
  CATEGORIES = %w[musculation course poids].freeze

  belongs_to :person

  validates :category, inclusion: { in: CATEGORIES }
  validates :performed_on, presence: true
  validates :description, presence: true
end
