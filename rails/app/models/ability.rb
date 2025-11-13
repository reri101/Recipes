class Ability
  include CanCan::Ability

  def initialize(user)

    case user.role
    when 'admin'
      can :manage, User
      can :manage, Photo
    when 'user'
      can :manage, Tag, user_id: user.id  
      can :manage, Category, user_id: user.id  
      can :manage, Ingredient, user_id: user.id  
      can :manage, Recipe, user_id: user.id  
      can :manage, Photo
    end
    end
end
