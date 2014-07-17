# ライブラリ : nokogiri ruby-mysql

require "uri"
require "open-uri"
require "nokogiri"
require "mysql"

AtCoderRootURL = "http://atcoder.jp/"

MySQLHost = "127.0.0.1"
MySQLUser = "root"
MYSQLPass = ""
DatabaseName = "atcoder_checker_db"

def url_exists_in_page?( contest_url, target_url )
	open( target_url ) do |html|
		html.each do |line|
			if line.index( contest_url ) != nil then
				return true
			end
		end
	end
end

def collect_problems( assignments_page_url )
	puts "Collect Problems : " + assignments_page_url

	assignments_page_dom = open( assignments_page_url ) do |html|
		Nokogiri::HTML.parse( html )
	end

	tbody = assignments_page_dom.at( "//th/text()[ . = '#' ]/ancestor::table/tbody" )

	tbody.xpath( "./tr" ).each do |tr|
		assignment = tr.xpath( "./td/a" )[0].text
		problem_screen_name = tr.xpath( "./td/a" )[1][ 'href' ].slice( 7 .. -1 )
		problem_name = tr.xpath( "./td/a" )[1].text

		yield assignment, problem_screen_name, problem_name
	end
end

def collect_submissions( submission_page_url, &callback )
	puts "Collect Submissions : " + submission_page_url

	submission_page_dom = open( submission_page_url ) do |html|
		Nokogiri::HTML.parse( html )
	end

	tbody = submission_page_dom.at( "//span[ @class = 'lang-en' ]/text()[ . = 'Created time' ]/ancestor::table/tbody" )

	tbody.xpath( "./tr" ).each do |tr|
		problem_screen_name = tr.at( "./td/a" )[ "href" ].slice( 7 .. -1 )

		submission_id = tr.at( ".//text()[ . = 'Details' ]/ancestor::a" )[ "href" ].match( /\/[0-9]*$/ )[0].slice( 1 .. -1 )

		score = tr.xpath( "./td//text()" )[5].text
		score = score =~ /^[0-9]*$/ ? score : "NULL"

		status = tr.at( "./td/span/text()" ).text

		language = tr.xpath( "./td/text()" )[1].text

		callback.call( problem_screen_name, submission_id, score, status, language )
	end

	next_page_url = "http://" + URI.parse( submission_page_url ).host + submission_page_dom.xpath( "//div[ contains( @class, 'pagination' ) ]/ul/li/a" ).last[ "href" ]
	if submission_page_url != next_page_url then
		collect_submissions( next_page_url, &callback )
	end
end

#=====================================================

contest_url = URI.parse( ARGV[0] || gets )
contest_url = contest_url.scheme + "://" + contest_url.host + "/"

contest_page_dom = open( contest_url ) do |html|
	Nokogiri::HTML.parse( html )
end
if !url_exists_in_page?( contest_url, AtCoderRootURL ) || contest_page_dom.at( ".insert-participant" ) != nil || contest_page_dom.at( "//a[ @href = '/assignments' ]" ) == nil then
	exit false
end

contest_name = contest_page_dom.at( "span.contest-name" ).text

puts "Target Contest : " + contest_name

begin
	mysql_connection =  Mysql::new( MySQLHost, MySQLUser, MYSQLPass, DatabaseName )
rescue
	puts "Database connection error!"
	exit false 
end

ret_status = true
begin
	mysql_connection.query( "start transaction" )

	sql = mysql_connection.prepare( "select contest_id from contest where url = ?" )
	if !sql.execute( contest_url ).fetch then

		puts "Insert Contest : " + contest_name
		sql = mysql_connection.prepare( "insert into contest ( url, name ) values ( ?, ? )" )
		sql.execute( contest_url, contest_name );
		sql = mysql_connection.prepare( "select contest_id from contest where url = ?" )
		contest_id = sql.execute( contest_url ).fetch[0]

		collect_problems( contest_url + "assignments" ) do | assignment, problem_screen_name, problem_name |
			puts "Insert Problem : " + problem_name
			sql = mysql_connection.prepare( "insert into problem ( contest_id, assignment, screen_name, name ) values ( ?, ?, ?, ? )" )
			sql.execute( contest_id, assignment, problem_screen_name, problem_name )
		end
	end

	sql = mysql_connection.prepare( "select contest_id from contest where url = ?" )
	contest_id = sql.execute( contest_url ).fetch[0]

	mysql_connection.query( "select user_id from user" ).each do | tuple |
		user_id = tuple[0]
		submission_page_url = contest_url + "submissions/all/1?user_screen_name=" + user_id

		collect_submissions( submission_page_url ) do | problem_screen_name, submission_id, score, status, language |
			sql = mysql_connection.prepare( "select submission_id from submission where submission_id = ?" )
			if sql.execute( submission_id ).fetch then
				next
			end

			sql = mysql_connection.prepare( "select problem_id from problem where contest_id = ? and screen_name = ?" )
			problem_id = sql.execute( contest_id, problem_screen_name ).fetch[0].to_s

			puts "Insert Submissin : " + user_id + "'s submission for " + problem_screen_name

			if score != "NULL" then
				sql = mysql_connection.prepare( "insert into submission values ( ?, ?, ?, ?, ?, ? )" )
				sql.execute( submission_id, problem_id, user_id, score, status, language )
			else
				sql = mysql_connection.prepare( "insert into submission ( submission_id, problem_id, user_id, status, language ) values ( ?, ?, ?, ?, ? )" )
				sql.execute( submission_id, problem_id, user_id, status, language )
			end
		end
	end

	puts "Update Timestamp"
	sql = mysql_connection.prepare( "update contest set updated_at = NULL where contest_id = ?" )
	sql.execute( contest_id )
rescue
	puts "Error!"
	mysql_connection.query( "rollback" )
	ret_status = false
else
	mysql_connection.query( "commit" )
ensure
	mysql_connection.close
end

exit ret_status
