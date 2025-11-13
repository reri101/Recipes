Rails.application.configure do
  config.secret_key_base = 'aa488c39201130d0b9230659199da53b786bf77b0348b3d9b2d54655eb0072e3690a38ba8451790426f77ec829afabd247cc5d041f7ee6a8abc83f4ddfeb081b'


  config.cache_classes = true

  config.eager_load = true

  config.consider_all_requests_local       = false


  config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?


  config.active_storage.service = :local


  config.log_level = :debug

  config.log_tags = [ :request_id ]



  config.action_mailer.perform_caching = false


  config.i18n.fallbacks = true

  config.active_support.deprecation = :notify

  config.log_formatter = ::Logger::Formatter.new


  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger           = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger    = ActiveSupport::TaggedLogging.new(logger)
  end

  config.active_record.dump_schema_after_migration = false
end
