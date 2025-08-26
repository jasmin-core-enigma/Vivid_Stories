export type JobStatus = 'queued' | 'running' | 'done' | 'error'

export interface QueuePort {
  enqueue<TPayload>(input: { type: string; payload: TPayload }): Promise<{ jobId: string }>
  getStatus(jobId: string): Promise<{ status: JobStatus; progress?: number; result?: unknown; error?: string }>
}
