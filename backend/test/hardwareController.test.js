// test/hardwareController.test.js
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { expect } = chai;

const Hardware = require('../models/Hardware');
const Procurement = require('../models/Procurement');
const hardwareController = require('../controllers/hardwareController');

describe('Hardware Controller', () => {
  afterEach(() => sinon.restore());

  describe('listHardware', () => {
    it('should return a list of hardware', async () => {
      const list = [{ name: 'Laptop', assetTag: 'A001' }];
      sinon.stub(Hardware, 'find').resolves(list);

      const req = {};
      const res = { json: sinon.spy() };

      await hardwareController.listHardware(req, res);
      expect(res.json.calledWith(list)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Hardware, 'find').rejects(new Error('DB error'));
      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await hardwareController.listHardware(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB error' })).to.be.true;
    });
  });

  describe('createHardware', () => {
    it('should create hardware and update procurement if provided', async () => {
      const req = {
        body: {
          assetTag: 'A001',
          name: 'Laptop',
          registeredBy: 'Admin',
          procurementId: new mongoose.Types.ObjectId()
        }
      };

      const hwSaveStub = sinon.stub(Hardware.prototype, 'save').resolvesThis();
      const procUpdateStub = sinon.stub(Procurement, 'findByIdAndUpdate').resolves();

      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await hardwareController.createHardware(req, res);

      expect(hwSaveStub.calledOnce).to.be.true;
      expect(procUpdateStub.calledOnceWith(req.body.procurementId, { status: 'Registered' })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(sinon.match.has('hardware'))).to.be.true;
    });

    it('should return 500 on save error', async () => {
      const req = { body: {} };
      sinon.stub(Hardware.prototype, 'save').rejects(new Error('DB error'));
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await hardwareController.createHardware(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'DB error' })).to.be.true;
    });
  });

  describe('assignHardware', () => {
    it('should assign hardware', async () => {
      const updated = { _id: new mongoose.Types.ObjectId(), status: 'assigned' };
      sinon.stub(Hardware, 'findByIdAndUpdate').resolves(updated);

      const req = { params: { id: updated._id }, body: { assignedTo: 'User1' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await hardwareController.assignHardware(req, res);

      expect(res.json.calledWith(updated)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Hardware, 'findByIdAndUpdate').rejects(new Error('DB error'));
      const req = { params: { id: '123' }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await hardwareController.assignHardware(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe('decommissionHardware', () => {
    it('should decommission hardware', async () => {
      const updated = { _id: new mongoose.Types.ObjectId(), status: 'decommissioned' };
      sinon.stub(Hardware, 'findByIdAndUpdate').resolves(updated);

      const req = { params: { id: updated._id } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await hardwareController.decommissionHardware(req, res);
      expect(res.json.calledWith(updated)).to.be.true;
    });
  });

  describe('deleteHardware', () => {
    it('should delete hardware', async () => {
      const id = new mongoose.Types.ObjectId();
      sinon.stub(Hardware, 'findByIdAndDelete').resolves({});
      const req = { params: { id } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await hardwareController.deleteHardware(req, res);
      expect(res.json.calledWith({ message: 'Hardware deleted successfully' })).to.be.true;
    });

    it('should return 404 if not found', async () => {
      const id = new mongoose.Types.ObjectId();
      sinon.stub(Hardware, 'findByIdAndDelete').resolves(null);
      const req = { params: { id } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await hardwareController.deleteHardware(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Hardware not found' })).to.be.true;
    });

    it('should return 400 for invalid ID', async () => {
      const req = { params: { id: 'invalid-id' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await hardwareController.deleteHardware(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Invalid hardware ID format' })).to.be.true;
    });
  });

  describe('updateHardware', () => {
    it('should update hardware successfully', async () => {
      const updated = { _id: new mongoose.Types.ObjectId() };
      sinon.stub(Hardware, 'findByIdAndUpdate').resolves(updated);

      const req = { params: { id: updated._id }, body: { name: 'Updated Laptop' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await hardwareController.updateHardware(req, res);
      expect(res.json.calledWith(sinon.match({ hardware: updated }))).to.be.true;
    });

    it('should return 404 if not found', async () => {
      sinon.stub(Hardware, 'findByIdAndUpdate').resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await hardwareController.updateHardware(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 400 for invalid ID', async () => {
      const req = { params: { id: 'invalid' }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await hardwareController.updateHardware(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });
  });

  describe('getHardwareById', () => {
    it('should return hardware by ID', async () => {
      const hw = { _id: new mongoose.Types.ObjectId() };
      sinon.stub(Hardware, 'findById').resolves(hw);

      const req = { params: { id: hw._id } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await hardwareController.getHardwareById(req, res);
      expect(res.json.calledWith(hw)).to.be.true;
    });

    it('should return 404 if not found', async () => {
      sinon.stub(Hardware, 'findById').resolves(null);
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await hardwareController.getHardwareById(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 400 for invalid ID', async () => {
      const req = { params: { id: 'invalid' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await hardwareController.getHardwareById(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });
  });
});
