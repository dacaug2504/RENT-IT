import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import EditProductDetails from './EditProductDetails';
import EditProductImages from './EditProductImages';

const EditProduct = () => {
  const { otId } = useParams();

  return (
    <Container className="py-5">
      <Card className="p-4 shadow">
        <h3 className="mb-4 text-center">
          ✏️ Edit Product (ID: {otId})
        </h3>

        <Row className="g-4">
          {/* LEFT: PRODUCT DETAILS */}
          <Col md={6}>
            <Card className="h-100 p-3 border-0 shadow-sm">
              <h5 className="mb-3">📝 Edit Details</h5>
              <EditProductDetails otId={otId} />
            </Card>
          </Col>

          {/* RIGHT: PRODUCT IMAGES */}
          <Col md={6}>
            <Card className="h-100 p-3 border-0 shadow-sm">
              <h5 className="mb-3">🖼️ Edit Images</h5>
              <EditProductImages otId={otId} />
            </Card>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default EditProduct;
