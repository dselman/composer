/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const chai = require('chai');
chai.should();
const sinon = require('sinon');

const XmlSchemaVisitor = require('../../../../lib/codegen/fromcto/xmlschema/xmlschemavisitor.js');

const BusinessNetworkDefinition = require('../../../../lib/businessnetworkdefinition');
const ScriptManager = require('../../../../lib/scriptmanager');
const ClassDeclaration = require('../../../../lib/introspect/classdeclaration');
const Script = require('../../../../lib/introspect/script');
const EnumDeclaration = require('../../../../lib/introspect/enumdeclaration');

const Field = require('../../../../lib/introspect/field');
const RelationshipDeclaration = require('../../../../lib/introspect/relationshipdeclaration');
const EnumValueDeclaration = require('../../../../lib/introspect/enumvaluedeclaration');
const FunctionDeclaration = require('../../../../lib/introspect/functiondeclaration');

const fileWriter = require('../../../../lib/codegen/filewriter.js');

describe('XmlSchemaVisitor', function () {
    let xmlSchemaVisitor;
    let mockFileWriter;
    beforeEach(() => {
        xmlSchemaVisitor = new XmlSchemaVisitor();
        mockFileWriter = sinon.createStubInstance(fileWriter);
    });

    describe('visit', () => {
        let param;
        beforeEach(() => {
            param = {
                fileWriter: mockFileWriter
            };
        });
        it('should return visitBusinessNetwork for a BusinessNetworkDefintion', () => {
            let thing = sinon.createStubInstance(BusinessNetworkDefinition);
            let mockSpecialVisit = sinon.stub(xmlSchemaVisitor, 'visitBusinessNetwork');
            mockSpecialVisit.returns('Duck');

            xmlSchemaVisitor.visit(thing, param).should.deep.equal('Duck');

            mockSpecialVisit.calledWith(thing, param).should.be.ok;
        });

        it('should return visitScriptManager for a ScriptManager', () => {
            let thing = sinon.createStubInstance(ScriptManager);
            let mockSpecialVisit = sinon.stub(xmlSchemaVisitor, 'visitScriptManager');
            mockSpecialVisit.returns('Duck');

            xmlSchemaVisitor.visit(thing, param).should.deep.equal('Duck');

            mockSpecialVisit.calledWith(thing, param).should.be.ok;
        });

        it('should return visitScript for a Script', () => {
            let thing = sinon.createStubInstance(Script);
            let mockSpecialVisit = sinon.stub(xmlSchemaVisitor, 'visitScript');
            mockSpecialVisit.returns('Duck');

            xmlSchemaVisitor.visit(thing, param).should.deep.equal('Duck');

            mockSpecialVisit.calledWith(thing, param).should.be.ok;
        });

        it('should return visitEnumDeclaration for a EnumDeclaration', () => {
            let thing = sinon.createStubInstance(EnumDeclaration);
            let mockSpecialVisit = sinon.stub(xmlSchemaVisitor, 'visitEnumDeclaration');
            mockSpecialVisit.returns('Duck');

            xmlSchemaVisitor.visit(thing, param).should.deep.equal('Duck');

            mockSpecialVisit.calledWith(thing, param).should.be.ok;
        });

        it('should return visitClassDeclaration for a ClassDeclaration', () => {
            let thing = sinon.createStubInstance(ClassDeclaration);
            let mockSpecialVisit = sinon.stub(xmlSchemaVisitor, 'visitClassDeclaration');
            mockSpecialVisit.returns('Duck');

            xmlSchemaVisitor.visit(thing, param).should.deep.equal('Duck');

            mockSpecialVisit.calledWith(thing, param).should.be.ok;
        });

        it('should return visitField for a Field', () => {
            let thing = sinon.createStubInstance(Field);
            let mockSpecialVisit = sinon.stub(xmlSchemaVisitor, 'visitField');
            mockSpecialVisit.returns('Duck');

            xmlSchemaVisitor.visit(thing, param).should.deep.equal('Duck');

            mockSpecialVisit.calledWith(thing, param).should.be.ok;
        });

        it('should return visitRelationship for a RelationshipDeclaration', () => {
            let thing = sinon.createStubInstance(RelationshipDeclaration);
            let mockSpecialVisit = sinon.stub(xmlSchemaVisitor, 'visitRelationship');
            mockSpecialVisit.returns('Duck');

            xmlSchemaVisitor.visit(thing, param).should.deep.equal('Duck');

            mockSpecialVisit.calledWith(thing, param).should.be.ok;
        });

        it('should return visitEnumValueDeclaration for a EnumValueDeclaration', () => {
            let thing = sinon.createStubInstance(EnumValueDeclaration);
            let mockSpecialVisit = sinon.stub(xmlSchemaVisitor, 'visitEnumValueDeclaration');
            mockSpecialVisit.returns('Duck');

            xmlSchemaVisitor.visit(thing, param).should.deep.equal('Duck');

            mockSpecialVisit.calledWith(thing, param).should.be.ok;
        });

        it('should return visitFunctionDeclaration for a FunctionDeclaration', () => {
            let thing = sinon.createStubInstance(FunctionDeclaration);
            let mockSpecialVisit = sinon.stub(xmlSchemaVisitor, 'visitFunctionDeclaration');
            mockSpecialVisit.returns('Duck');

            xmlSchemaVisitor.visit(thing, param).should.deep.equal('Duck');

            mockSpecialVisit.calledWith(thing, param).should.be.ok;
        });

        it('should throw an error when an unrecognised type is supplied', () => {
            let thing = 'Something of unrecognised type';

            (() => {
                xmlSchemaVisitor.visit(thing, param);
            }).should.throw('Unrecognised "Something of unrecognised type"');
        });
    });

    describe('visitBusinessNetwork', () => {
        it('should write the business network data to a xsd file', () => {
            let param = {
                fileWriter: mockFileWriter
            };

            let acceptSpy = sinon.spy();

            let mockBusinessNetwork = sinon.createStubInstance(BusinessNetworkDefinition);
            mockBusinessNetwork.getDescription.returns('Business network description text');
            mockBusinessNetwork.getIntrospector.returns({
                getClassDeclarations: () => {
                    return [{
                        accept: acceptSpy
                    },
                    {
                        accept: acceptSpy
                    }];
                }
            });
            mockBusinessNetwork.getIdentifier.returns('Penguin');
            mockBusinessNetwork.getScriptManager.returns({
                accept: acceptSpy
            });

            xmlSchemaVisitor.visitBusinessNetwork(mockBusinessNetwork, param);

            param.fileWriter.openFile.withArgs('model.xsd').calledOnce.should.be.ok;
            param.fileWriter.writeLine.callCount.should.deep.equal(3);
            param.fileWriter.writeLine.getCall(0).args.should.deep.equal([0, '<?xml version=\"1.0\"?>']);
            param.fileWriter.writeLine.getCall(1).args.should.deep.equal([0, '<xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">']);
            param.fileWriter.writeLine.getCall(2).args.should.deep.equal([0, '</xs:schema>']);
            param.fileWriter.closeFile.calledOnce.should.be.ok;

            acceptSpy.withArgs(xmlSchemaVisitor, param).calledTwice.should.be.ok;
        });
    });

    describe('visitScriptManager', () => {
        it('should call accept for each function declaration', () => {
            let acceptSpy = sinon.spy();

            let param = {};

            let mockScript = sinon.createStubInstance(ScriptManager);
            mockScript.getScripts.returns([{
                accept: acceptSpy
            },
            {
                accept: acceptSpy
            }]);

            xmlSchemaVisitor.visitScriptManager(mockScript, param);

            acceptSpy.withArgs(xmlSchemaVisitor, param).calledTwice.should.be.ok;
        });
    });

    describe('visitScript', () => {
        it('should call accept for each function declaration', () => {
            let acceptSpy = sinon.spy();

            let param = {};

            let mockScript = sinon.createStubInstance(Script);
            mockScript.getFunctionDeclarations.returns([{
                accept: acceptSpy
            },
            {
                accept: acceptSpy
            }]);

            xmlSchemaVisitor.visitScript(mockScript, param);

            acceptSpy.withArgs(xmlSchemaVisitor, param).calledTwice.should.be.ok;
        });
    });

    describe('visitFunctionDeclaration', () => {
        it('should ignore function declarations', () => {
            let param = {
                fileWriter: mockFileWriter
            };

            let mockFunctionDeclaration = sinon.createStubInstance(FunctionDeclaration);
            mockFunctionDeclaration.getVisibility.returns('public');
            mockFunctionDeclaration.getReturnType.returns('string');
            mockFunctionDeclaration.getName.returns('Bob');
            mockFunctionDeclaration.getParameterTypes.returns('boolean');

            xmlSchemaVisitor.visitFunctionDeclaration(mockFunctionDeclaration, param);
            param.fileWriter.writeLine.calledOnce.should.be.false;
        });
    });

    describe('visitEnumDeclaration', () => {
        it('should write the class declaration for an enum', () => {
            let acceptSpy = sinon.spy();

            let param = {
                fileWriter: mockFileWriter
            };

            let mockEnumDeclaration = sinon.createStubInstance(EnumDeclaration);
            mockEnumDeclaration.getFullyQualifiedName.returns('org.acme.Person');
            mockEnumDeclaration.getOwnProperties.returns([{
                accept: acceptSpy
            },
            {
                accept: acceptSpy
            }]);

            xmlSchemaVisitor.visitEnumDeclaration(mockEnumDeclaration, param);

            param.fileWriter.writeLine.callCount.should.deep.equal(4);
            param.fileWriter.writeLine.getCall(0).args.should.deep.equal([0, '<xs:simpleType name=\"org.acme.Person\">']);
            param.fileWriter.writeLine.getCall(1).args.should.deep.equal([1, '<xs:restriction base=\"xs:string\">']);
            param.fileWriter.writeLine.getCall(2).args.should.deep.equal([1, '</xs:restriction>']);
            param.fileWriter.writeLine.getCall(3).args.should.deep.equal([0, '</xs:simpleType>']);

            acceptSpy.withArgs(xmlSchemaVisitor, param).calledTwice.should.be.ok;
        });

        it('should write the class declaration for an enum with a super type', () => {
            let acceptSpy = sinon.spy();

            let param = {
                fileWriter: mockFileWriter
            };

            let mockParticipantDeclaration = sinon.createStubInstance(EnumDeclaration);
            mockParticipantDeclaration.getFullyQualifiedName.returns('org.acme.Person');
            mockParticipantDeclaration.getOwnProperties.returns([{
                accept: acceptSpy
            },
            {
                accept: acceptSpy
            }]);
            mockParticipantDeclaration.getSuperType.returns('org.acme.Human');

            xmlSchemaVisitor.visitEnumDeclaration(mockParticipantDeclaration, param);

            param.fileWriter.writeLine.callCount.should.deep.equal(8);
            param.fileWriter.writeLine.getCall(0).args.should.deep.equal([0, '<xs:simpleType name=\"org.acme.Person_Own\">']);
            param.fileWriter.writeLine.getCall(1).args.should.deep.equal([1, '<xs:restriction base=\"xs:string\">']);
            param.fileWriter.writeLine.getCall(2).args.should.deep.equal([1, '</xs:restriction>']);
            param.fileWriter.writeLine.getCall(3).args.should.deep.equal([0, '</xs:simpleType>']);
            param.fileWriter.writeLine.getCall(4).args.should.deep.equal([0, '<xs:simpleType name=\"org.acme.Person\">']);
            param.fileWriter.writeLine.getCall(5).args.should.deep.equal([1, '<xs:union memberTypes=\"org.acme.Person_Own org.acme.Human\">']);
            param.fileWriter.writeLine.getCall(6).args.should.deep.equal([1, '</xs:union>']);
            param.fileWriter.writeLine.getCall(7).args.should.deep.equal([0, '</xs:simpleType>']);

            acceptSpy.withArgs(xmlSchemaVisitor, param).calledTwice.should.be.ok;
        });
    });


    describe('visitClassDeclaration', () => {
        it('should write the class declaration for a class', () => {
            let acceptSpy = sinon.spy();

            let param = {
                fileWriter: mockFileWriter
            };

            let mockClassDeclaration = sinon.createStubInstance(ClassDeclaration);
            mockClassDeclaration.getFullyQualifiedName.returns('org.acme.Person');
            mockClassDeclaration.getOwnProperties.returns([{
                accept: acceptSpy
            },
            {
                accept: acceptSpy
            }]);

            xmlSchemaVisitor.visitClassDeclaration(mockClassDeclaration, param);

            param.fileWriter.writeLine.callCount.should.deep.equal(4);
            param.fileWriter.writeLine.getCall(0).args.should.deep.equal([0, '<xs:complexType name=\"org.acme.Person\">']);
            param.fileWriter.writeLine.getCall(1).args.should.deep.equal([1, '<xs:sequence>']);
            param.fileWriter.writeLine.getCall(2).args.should.deep.equal([1, '</xs:sequence>']);
            param.fileWriter.writeLine.getCall(3).args.should.deep.equal([0, '</xs:complexType>']);

            acceptSpy.withArgs(xmlSchemaVisitor, param).calledTwice.should.be.ok;
        });

        it('should write the class declaration for a class with a super type', () => {
            let acceptSpy = sinon.spy();

            let param = {
                fileWriter: mockFileWriter
            };

            let mockClassDeclaration = sinon.createStubInstance(ClassDeclaration);
            mockClassDeclaration.getFullyQualifiedName.returns('org.acme.Person');
            mockClassDeclaration.getOwnProperties.returns([{
                accept: acceptSpy
            },
            {
                accept: acceptSpy
            }]);
            mockClassDeclaration.getSuperType.returns('org.acme.Human');

            xmlSchemaVisitor.visitClassDeclaration(mockClassDeclaration, param);

            param.fileWriter.writeLine.callCount.should.deep.equal(8);
            param.fileWriter.writeLine.getCall(0).args.should.deep.equal([0, '<xs:complexType name=\"org.acme.Person\">']);
            param.fileWriter.writeLine.getCall(1).args.should.deep.equal([1, '<xs:complexContent>']);
            param.fileWriter.writeLine.getCall(2).args.should.deep.equal([1, '<xs:extension base=\"org.acme.Human\">']);
            param.fileWriter.writeLine.getCall(3).args.should.deep.equal([1, '<xs:sequence>']);
            param.fileWriter.writeLine.getCall(4).args.should.deep.equal([1, '</xs:sequence>']);
            param.fileWriter.writeLine.getCall(5).args.should.deep.equal([1, '</xs:extension>']);
            param.fileWriter.writeLine.getCall(6).args.should.deep.equal([1, '</xs:complexContent>']);
            param.fileWriter.writeLine.getCall(7).args.should.deep.equal([0, '</xs:complexType>']);

            acceptSpy.withArgs(xmlSchemaVisitor, param).calledTwice.should.be.ok;
        });
    });

    describe('visitField', () => {
        it('should write a line for a field', () => {
            let param = {
                fileWriter: mockFileWriter
            };

            let mockField = sinon.createStubInstance(Field);
            mockField.getFullyQualifiedTypeName.returns('String');
            mockField.getName.returns('Bob');

            xmlSchemaVisitor.visitField(mockField, param);
            param.fileWriter.writeLine.withArgs(2, '<xs:element name="Bob" type="xs:string"/>').calledOnce.should.be.ok;
        });

        it('should write a line for a field thats an array', () => {
            let param = {
                fileWriter: mockFileWriter
            };

            let mockField = sinon.createStubInstance(Field);
            mockField.getFullyQualifiedTypeName.returns('String');
            mockField.getName.returns('Bob');
            mockField.isArray.returns(true);

            xmlSchemaVisitor.visitField(mockField, param);
            param.fileWriter.writeLine.withArgs(2, '<xs:element name="Bob" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>').calledOnce.should.be.ok;
        });
    });

    describe('visitEnumValueDeclaration', () => {
        it('should write a line for a enum value', () => {
            let param = {
                fileWriter: mockFileWriter
            };

            let mockEnumValueDecl = sinon.createStubInstance(EnumValueDeclaration);
            mockEnumValueDecl.getName.returns('Bob');

            xmlSchemaVisitor.visitEnumValueDeclaration(mockEnumValueDecl, param);

            param.fileWriter.writeLine.withArgs(2, '<xs:enumeration value="Bob"/>').calledOnce.should.be.ok;
        });
    });

    describe('visitRelationship', () => {
        it('should write a line for a relationship', () => {
            let param = {
                fileWriter: mockFileWriter
            };

            let mockRelationship = sinon.createStubInstance(RelationshipDeclaration);
            mockRelationship.getType.returns('string');
            mockRelationship.getName.returns('Bob');

            xmlSchemaVisitor.visitRelationship(mockRelationship, param);

            param.fileWriter.writeLine.withArgs(1, '+ string Bob');
        });

        it('should write a line for a relationship thats an array', () => {
            let param = {
                fileWriter: mockFileWriter
            };

            let mockRelationship = sinon.createStubInstance(RelationshipDeclaration);
            mockRelationship.getType.returns('string');
            mockRelationship.getName.returns('Bob');
            mockRelationship.isArray.returns(true);

            xmlSchemaVisitor.visitRelationship(mockRelationship, param);

            param.fileWriter.writeLine.withArgs(1, '+ string Bob');
        });
    });
});