require 'em-websocket'

Process.daemon(nochdir=true) if ARGV[0] == "-D"
connections = Array.new

EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 55555) do |ws|
  ws.onopen {
    connections.push(ws) unless connections.index(ws)
    puts 'open.'
  }
  ws.onmessage { |msg|
    connections.each {|con|
      con.send(msg) unless con == ws
    }
  }
  ws.onclose   { puts 'closed.' }
end
