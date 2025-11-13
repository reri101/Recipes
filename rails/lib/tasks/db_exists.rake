namespace :db do
  desc "Checks to see if the database exists"
  task :exists do
    begin
      Rake::Task['environment'].invoke
      ActiveRecord::Base.connection
      unless ActiveRecord::Base.connection.table_exists? 'schema_migrations'
        raise ActiveRecord::NoDatabaseError
      end
    rescue ActiveRecord::NoDatabaseError => e
      puts e.message
      puts e.backtrace
      exit 1
    rescue Exception => e
      # for any other error we assume db exists
      puts e.message
      puts e.backtrace
      exit 0
    else
      puts 'database exists'
      exit 0
    end
  end
end