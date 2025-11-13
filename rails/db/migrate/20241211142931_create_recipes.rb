class CreateRecipes < ActiveRecord::Migration[7.0]
  def change
    create_table :recipes do |t|
      t.string :name, null: false
      t.string :description, null: false
      t.integer :preparation_time, null: false
      t.references :photo, foreign_key: true
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
