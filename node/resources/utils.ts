import { TenantClient } from '@vtex/api'

const STORE_PRODUCT = 'vtex.storefront'

export const notFound = <T>(fallback: T) => (error: any): T => {
  if (error.response && error.response.status === 404) {
    return fallback
  }
  throw error
}

export const currentDate = (): string => new Date().toISOString().split('T')[0]

export class SitemapNotFound extends Error {}

export const SITEMAP_URL = '/_v/public/newsitemap(/:bindingIdentifier)/:path'

export const getStoreBindings = async (tenant: TenantClient) => {
  const tenantInfo = await tenant.info()
  return tenantInfo.bindings.filter(
    binding => binding.targetProduct === STORE_PRODUCT
  )
}
