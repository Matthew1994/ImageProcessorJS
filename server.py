import tornado.ioloop
import tornado.web
import tornado.options
import os.path
import tornado.httpserver
from tornado.options import define, options
define("port", default=8888, help="run on the given port", type=int)
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

application = tornado.web.Application(
	handlers=[(r"/", MainHandler)],
	template_path=os.path.join(os.path.dirname(__file__), "templates"),
    static_path=os.path.join(os.path.dirname(__file__), "static"),
    debug=True)

if __name__ == "__main__":
	tornado.options.parse_command_line()
	http_server = tornado.httpserver.HTTPServer(application)

	http_server.listen(options.port)
    # application.listen(8888)
	tornado.ioloop.IOLoop.current().start()