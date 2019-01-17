import * as cheerio from 'cheerio'
import {map, values} from 'ramda'
import {RoutesDataSource} from '../resources/RoutesDataSource'

export const userSitemap = async (ctx: Context) => {
  const routes = new RoutesDataSource(ctx.vtex, {timeout: 2000})
  const userRoutes = values((await routes.getUserRoutes())['vtex.admin-pages'])
  const $ = cheerio.load('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
    decodeEntities: false,
    xmlMode: true,
  })

  const forwardedHost = ctx.get('x-forwarded-host')

  $('urlset').append(map((route: any) => `<url>
    <loc>https://${forwardedHost}${route.path}</loc>
    <lastmod>${(new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>`, userRoutes))

  ctx.set('Content-Type', 'text/xml')
  ctx.body = $.xml()
}
