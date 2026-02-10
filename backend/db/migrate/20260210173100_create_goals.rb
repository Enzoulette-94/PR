class CreateGoals < ActiveRecord::Migration[8.1]
  def change
    create_table :goals do |t|
      t.references :person, null: false, foreign_key: true
      t.string :title, null: false
      t.integer :position, null: false, default: 0
      t.boolean :completed, null: false, default: false

      t.timestamps
    end

    add_index :goals, [:person_id, :position]
  end
end
