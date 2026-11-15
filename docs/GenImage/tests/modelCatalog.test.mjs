import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  isImageGenerationModel,
  normalizeModelCatalog
} from '../src/services/modelCatalogPolicy.ts'

// Shape returned by https://bya.re/v1/models (captured from the live API).
const livePayload = {
  object: 'list',
  data: [
    { id: 'auto', object: 'model', created: 1704067200, owned_by: 'openai', type: 'model', display_name: 'auto' },
    { id: 'gpt-5.6', object: 'model', created: 1780876800, owned_by: 'openai', type: 'model', display_name: 'GPT-5.6 (Sol)' },
    { id: 'gpt-image-2', object: 'model', created: 1738368000, owned_by: 'openai', type: 'model', display_name: 'GPT Image 2' },
    { id: 'gpt-image-2.5', object: 'model', created: 1704067200, owned_by: 'openai', type: 'model', display_name: 'gpt-image-2.5' },
    { id: 'gpt-image-2.5-flare', object: 'model', created: 1788825600, owned_by: 'openai', type: 'model', display_name: 'GPT Image 2.5 Flare' }
  ]
}

test('keeps only image models and preserves the API order', () => {
  const catalog = normalizeModelCatalog(livePayload)

  assert.equal(catalog.total, 5)
  assert.equal(catalog.fallback, false)
  assert.deepEqual(catalog.models.map((model) => model.id), [
    'gpt-image-2',
    'gpt-image-2.5',
    'gpt-image-2.5-flare'
  ])
  assert.deepEqual(catalog.models[0], {
    id: 'gpt-image-2',
    name: 'GPT Image 2',
    createdAt: 1738368000000
  })
})

test('text models such as gpt-5.6 are never offered as image models', () => {
  assert.equal(isImageGenerationModel({ id: 'gpt-5.6', display_name: 'GPT-5.6 (Sol)' }), false)
  assert.equal(isImageGenerationModel({ id: 'auto', type: 'model' }), false)
  assert.equal(isImageGenerationModel({ id: 'gpt-image-2.6' }), true)
  assert.equal(isImageGenerationModel({ id: 'nano-banana-pro' }), true)
  assert.equal(isImageGenerationModel({ id: 'dall-e-3' }), true)
  assert.equal(isImageGenerationModel({ id: 'google/imagen-4.0-ultra' }), true)
  assert.equal(isImageGenerationModel({ id: 'flux-1.1-pro' }), true)
  assert.equal(isImageGenerationModel({ id: 'gpt-4o-tts' }), false)
})

test('falls back to the full list when nothing looks like an image model', () => {
  const catalog = normalizeModelCatalog({
    data: [
      { id: 'model-a', display_name: 'Model A' },
      { id: 'model-b', display_name: 'Model B' }
    ]
  })

  assert.equal(catalog.fallback, true)
  assert.deepEqual(catalog.models.map((model) => model.id), ['model-a', 'model-b'])
})

test('respects explicit output modalities over the id heuristic', () => {
  const catalog = normalizeModelCatalog({
    data: [
      { id: 'google/gemini-3.8-flash', output_modalities: ['text'] },
      { id: 'openai/gpt-image-2.6-flare', output_modalities: ['text', 'image'] },
      { id: 'x-ai/grok-imagine-image-2.0', output_modalities: ['image'] }
    ]
  })

  assert.deepEqual(catalog.models.map((model) => model.id), [
    'openai/gpt-image-2.6-flare',
    'x-ai/grok-imagine-image-2.0'
  ])
  assert.equal(catalog.total, 3)
})

test('accepts bare arrays, { models } payloads and plain string ids', () => {
  assert.deepEqual(normalizeModelCatalog(['gpt-image-2']).models.map((model) => model.id), ['gpt-image-2'])
  assert.deepEqual(
    normalizeModelCatalog({ models: [{ id: 'gpt-image-2.6' }] }).models.map((model) => model.id),
    ['gpt-image-2.6']
  )
  assert.deepEqual(normalizeModelCatalog({ data: { models: ['gpt-image-2.5'] } }).models.map((model) => model.id), [
    'gpt-image-2.5'
  ])
})

test('dedupes model ids and skips unusable entries', () => {
  const catalog = normalizeModelCatalog({
    data: [
      { id: 'gpt-image-2' },
      { id: 'gpt-image-2', display_name: 'Duplicate' },
      { display_name: 'no id at all' },
      null,
      'gpt-image-2.5'
    ]
  })

  assert.deepEqual(catalog.models.map((model) => model.id), ['gpt-image-2', 'gpt-image-2.5'])
  assert.equal(catalog.total, 2)
})

test('handles empty or malformed payloads without throwing', () => {
  for (const payload of [null, undefined, 'oops', 42, {}, { data: 'nope' }]) {
    const catalog = normalizeModelCatalog(payload)
    assert.deepEqual(catalog.models, [])
    assert.equal(catalog.total, 0)
    assert.equal(catalog.fallback, false)
  }
})

test('keeps display names but falls back to the model id', () => {
  const catalog = normalizeModelCatalog({
    data: [
      { id: 'gpt-image-2.5', display_name: 'gpt-image-2.5' },
      { id: 'gpt-image-2.6-flare', display_name: 'GPT Image 2.6 Flare' }
    ]
  })

  assert.equal(catalog.models[0].name, 'gpt-image-2.5')
  assert.equal(catalog.models[1].name, 'GPT Image 2.6 Flare')
})
