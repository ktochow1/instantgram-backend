class AddLikesToPosts01 < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :likes, :integer
  end
end
