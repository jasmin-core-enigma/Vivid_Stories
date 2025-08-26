export interface StoragePort {
  putObject(input: { key: string; contentType: string; data: Blob | ArrayBuffer }): Promise<{ url: string; key: string }>
  getSignedUrl(key: string, ttlSeconds: number): Promise<{ url: string }>
  deleteObject(key: string): Promise<void>
}
