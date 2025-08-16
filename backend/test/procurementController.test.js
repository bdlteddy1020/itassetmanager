// test/procurementController.test.js
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { expect } = chai;

const Procurement = require('../models/Procurement');
const Hardware = require('../models/Hardware');
const {
  createProcurement,
  getProcurements,
  approveProcurement,
  chargeToOrder,
  markDelivered,
  deleteProcurement,
  getProcurementById
} = require('../controllers/procurementController');

describe("Procurement Controller", () => {
  afterEach(() => sinon.restore());

  describe("createProcurement", () => {
    it("should create a new procurement successfully", async () => {
      const req = { body: { itemName: "Laptop", quantity: 1 } };
      const saveStub = sinon.stub(Procurement.prototype, "save").resolvesThis();

      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await createProcurement(req, res);

      expect(saveStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(sinon.match.instanceOf(Procurement))).to.be.true;
    });

    it("should return 400 on error", async () => {
      const req = { body: {} };
      sinon.stub(Procurement.prototype, "save").rejects(new Error("Validation error"));

      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await createProcurement(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Validation error" })).to.be.true;
    });
  });

  describe("getProcurements", () => {
    it("should return a list of procurements", async () => {
      const list = [{ _id: new mongoose.Types.ObjectId(), itemName: "Laptop" }];
      sinon.stub(Procurement, "find").returns({ sort: sinon.stub().resolves(list) });

      const req = {};
      const res = { json: sinon.spy() };

      await getProcurements(req, res);

      expect(res.json.calledWith(list)).to.be.true;
    });
  });

  describe("approveProcurement", () => {
    it("should approve a procurement", async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: { approvedBy: "Admin" } };
      const updated = { _id: req.params.id, status: "Approved" };

      sinon.stub(Procurement, "findByIdAndUpdate").resolves(updated);

      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      await approveProcurement(req, res);

      expect(res.json.calledWith(updated)).to.be.true;
    });

    it("should return 404 if procurement not found", async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      sinon.stub(Procurement, "findByIdAndUpdate").resolves(null);

      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      await approveProcurement(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Not found' })).to.be.true;
    });
  });

  describe("chargeToOrder", () => {
    it("should mark procurement as ordered", async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: { orderedBy: "Admin" } };
      const updated = { _id: req.params.id, status: "Ordered" };

      sinon.stub(Procurement, "findByIdAndUpdate").resolves(updated);

      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      await chargeToOrder(req, res);

      expect(res.json.calledWith(updated)).to.be.true;
    });

    it("should return 404 if procurement not found", async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      sinon.stub(Procurement, "findByIdAndUpdate").resolves(null);

      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      await chargeToOrder(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Not found' })).to.be.true;
    });
  });

  describe("markDelivered", () => {
    it("should mark procurement as delivered without hardware creation", async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: { deliveredBy: "Admin" } };
      const updated = { _id: req.params.id, status: "Delivered" };

      sinon.stub(Procurement, "findByIdAndUpdate").resolves(updated);

      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      await markDelivered(req, res);

      expect(res.json.calledWith(updated)).to.be.true;
    });

    it("should create hardware items if requested", async () => {
      const hwItems = [{ name: "Laptop" }];
      const procurement = { _id: new mongoose.Types.ObjectId(), save: sinon.stub().resolvesThis() };

      sinon.stub(Procurement, "findByIdAndUpdate").resolves(procurement);
      const hwSaveStub = sinon.stub(Hardware.prototype, "save").resolvesThis();

      const req = {
        params: { id: procurement._id },
        body: { deliveredBy: "Admin", createHardware: true, hardwareItems: hwItems }
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await markDelivered(req, res);

      expect(hwSaveStub.callCount).to.equal(hwItems.length);
      expect(procurement.save.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const response = res.json.firstCall.args[0];
      expect(response).to.have.property("createdHardware");
      expect(response).to.have.property("procurement");
    });

    it("should return 404 if procurement not found", async () => {
      sinon.stub(Procurement, "findByIdAndUpdate").resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await markDelivered(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Not found' })).to.be.true;
    });
  });

  describe("deleteProcurement", () => {
    it("should delete a procurement", async () => {
      sinon.stub(Procurement, "findByIdAndDelete").resolves({});

      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      await deleteProcurement(req, res);

      expect(res.json.calledWith({ status: 'ok', message: 'Procurement deleted successfully' })).to.be.true;
    });

    it("should return 404 if procurement not found", async () => {
      sinon.stub(Procurement, "findByIdAndDelete").resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      await deleteProcurement(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Procurement not found' })).to.be.true;
    });
  });

  describe("getProcurementById", () => {
    it("should return a procurement by ID", async () => {
      const procurement = { _id: new mongoose.Types.ObjectId(), itemName: "Laptop" };
      sinon.stub(Procurement, "findById").resolves(procurement);

      const req = { params: { id: procurement._id } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      await getProcurementById(req, res);

      expect(res.json.calledWith(procurement)).to.be.true;
    });

    it("should return 404 if procurement not found", async () => {
      sinon.stub(Procurement, "findById").resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
      await getProcurementById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'Not found' })).to.be.true;
    });
  });
});
