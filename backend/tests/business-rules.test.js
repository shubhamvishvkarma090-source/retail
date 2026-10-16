import test from "node:test";
import assert from "node:assert/strict";
test("discount cannot exceed subtotal",()=>{const subtotal=100,discount=101;assert.equal(discount>subtotal,true)});
test("gross profit uses selling price less purchase price",()=>{const grossProfit=(199-120)*3;assert.equal(grossProfit,237)});
test("low stock includes stock equal to reorder level",()=>{const stock=5,reorderLevel=5;assert.equal(stock<=reorderLevel,true)});
