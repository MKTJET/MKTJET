class CreateStories < ActiveRecord::Migration[8.0]
  def change
    create_table :stories do |t|
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
