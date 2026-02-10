class CreatePersonalRecords < ActiveRecord::Migration[8.1]
  def change
    create_table :personal_records do |t|
      t.references :person, null: false, foreign_key: true
      t.string :category, null: false
      t.date :performed_on, null: false
      t.text :description, null: false

      t.timestamps
    end

    add_index :personal_records, [:person_id, :performed_on]
  end
end
