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
  afterEach(() => {
    sinon.restore(); // cleanup after each test
  });

  describe("createProcurement", () => {
    it("should create a new procurement successfully", async () => {
      const req = { body: { item: "Laptop", cost: 1200 } };
      const saved = { _id: new mongoose.Types.ObjectId(), ...req.body };

      const saveStub = sinon.stub(Procurement.prototype, "save").resolves(saved);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createProcurement(req, res);

      expect(saveStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(saved)).to.be.true;
    });

    it("should return 400 on error", async () => {
      const req = { body: {} };
      sinon.stub(Procurement.prototype, "save").throws(new Error("Validation error"));

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await createProcurement(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Validation error" })).to.be.true;
    });
  });

  describe("getProcurements", () => {
    it("should return all procurements", async () => {
      const list = [{ item: "Mouse" }, { item: "Keyboard" }];
      sinon.stub(Procurement, "find").returns({ sort: sinon.stub().resolves(list) });

      const req = {};
      const res = { json: sinon.spy() };

      await getProcurements(req, res);

      expect(res.json.calledWith(list)).to.be.true;
    });
  });

  describe("approveProcurement", () => {
    it("should approve a procurement", async () => {
      const procurement = { _id: new mongoose.Types.ObjectId(), status: "Approved" };
      sinon.stub(Procurement, "findByIdAndUpdate").resolves(procurement);

      const req = { params: { id: procurement._id }, body: { approvedBy: "Admin" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await approveProcurement(req, res);

      expect(res.json.calledWith(procurement)).to.be.true;
    });

    it("should return 404 if not found", async () => {
      sinon.stub(Procurement, "findByIdAndUpdate").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await approveProcurement(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe("chargeToOrder", () => {
    it("should set status to Ordered", async () => {
      const procurement = { _id: new mongoose.Types.ObjectId(), status: "Ordered" };
      sinon.stub(Procurement, "findByIdAndUpdate").resolves(procurement);

      const req = { params: { id: procurement._id }, body: { orderedBy: "Admin" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await chargeToOrder(req, res);

      expect(res.json.calledWith(procurement)).to.be.true;
    });
  });

  describe("markDelivered", () => {
    it("should mark as delivered and create hardware if requested", async () => {
      const procurement = { _id: new mongoose.Types.ObjectId(), save: sinon.stub().resolvesThis() };
      sinon.stub(Procurement, "findByIdAndUpdate").resolves(procurement);

      const hardwareStub = sinon.stub(Hardware.prototype, "save").resolves({ _id: new mongoose.Types.ObjectId() });

      const req = {
        params: { id: procurement._id },
        body: { deliveredBy: "Admin", createHardware: true, hardwareItems: [{ name: "Dell Laptop" }] }
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await markDelivered(req, res);

      expect(hardwareStub.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe("deleteProcurement", () => {
    it("should delete procurement successfully", async () => {
      sinon.stub(Procurement, "findByIdAndDelete").resolves({ _id: new mongoose.Types.ObjectId() });

      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await deleteProcurement(req, res);

      expect(res.json.calledWithMatch({ status: "ok" })).to.be.true;
    });

    it("should return 404 if not found", async () => {
      sinon.stub(Procurement, "findByIdAndDelete").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await deleteProcurement(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe("getProcurementById", () => {
    it("should return a procurement by ID", async () => {
      const procurement = { _id: new mongoose.Types.ObjectId(), item: "Monitor" };
      sinon.stub(Procurement, "findById").resolves(procurement);

      const req = { params: { id: procurement._id } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getProcurementById(req, res);

      expect(res.json.calledWith(procurement)).to.be.true;
    });

    it("should return 404 if not found", async () => {
      sinon.stub(Procurement, "findById").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getProcurementById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
