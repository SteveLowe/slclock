import "jest";
import cache, { CacheItem } from "./cache";

interface TestItem extends CacheItem {
  name: string;
}

beforeEach(cache.clear);
afterAll(cache.clear);

test("Can set and get cache", () => {
  cache.set<TestItem>("testHit", {
    timestamp: new Date().toISOString(),
    name: "testHit"
  });
  expect(cache.count()).toBe(1);

  const item = cache.get<TestItem>("testHit", 500);
  expect(item?.name).toBe("testHit");
});

test("Cache miss returns nothing", () => {
  const item = cache.get<TestItem>("cacheMiss", 500);
  expect(item).toBeUndefined();
});

test("Stale cache returns nothing", () => {
  cache.set<TestItem>("testStale", {
    timestamp: "2019-05-28T12:00:00Z",
    name: "testStale"
  });
  expect(cache.count()).toBe(1);

  const item = cache.get<TestItem>("testStale", 500);
  expect(item).toBeUndefined();
});
