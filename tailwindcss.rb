require 'jekyll-tailwind'

Jekyll::Hooks.register :site, :post_write do |site|
  site.config['source'] = File.expand_path('assets', site.config['destination'])
end