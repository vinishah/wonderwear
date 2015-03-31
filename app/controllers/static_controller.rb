class StaticController < ApplicationController
  def index
    gon.vufind_key = ENV["VUFIND_APP_KEY"]
    gon.shopsense_key = ENV["SHOPSENSE_API_KEY"]
    gon.mashape_key = ENV["MASHAPE_CLIENT_SECRET"]
    gon.wonderwear_access_key = ENV["WONDERWEAR_AWS_ACCESS_KEY_ID"]
    gon.wonderwear_secret_key = ENV["WONDERWEAR_AWS_SECRET_ACCESS_KEY"]

  end
end
