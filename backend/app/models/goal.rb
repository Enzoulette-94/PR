class Goal < ApplicationRecord
  belongs_to :person

  validates :title, presence: true
end
