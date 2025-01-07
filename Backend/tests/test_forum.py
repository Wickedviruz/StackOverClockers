def test_get_categories_empty(test_client):
    """
    Testa att hämta kategorier när databasen är tom.
    """
    response = test_client.get("/forum/categories")
    assert response.status_code == 200
    assert response.json == []  # Det ska inte finnas några kategorier

def test_create_category(test_client):
    """
    Testa att skapa en ny kategori.
    """
    response = test_client.post(
        "/forum/categories",
        json={"name": "Test Category"},
    )
    assert response.status_code == 201
    assert response.json["message"] == "Category created successfully"
    assert response.json["category"]["name"] == "Test Category"

def test_create_duplicate_category(test_client):
    """
    Testa att skapa en kategori med samma namn (ska misslyckas).
    """
    test_client.post("/forum/categories", json={"name": "Duplicate"})
    response = test_client.post("/forum/categories", json={"name": "Duplicate"})
    assert response.status_code == 400
    assert response.json["message"] == "Category already exists"

def test_create_thread(test_client):
    """
    Testa att skapa en ny tråd i en subkategori.
    """
    # Först skapa en kategori och subkategori
    category_response = test_client.post("/forum/categories", json={"name": "Category 1"})
    category_id = category_response.json["category"]["id"]

    subcategory_response = test_client.post(
        f"/forum/categories/{category_id}/subcategories",
        json={"name": "Subcategory 1"}
    )
    subcategory_id = subcategory_response.json["subcategory"]["id"]

    # Skapa tråd i subkategorin
    response = test_client.post(
        "/forum/threads",
        json={"title": "Thread 1", "content": "This is a test thread", "subcategory_id": subcategory_id}
    )
    assert response.status_code == 201
    assert response.json["message"] == "Thread created successfully"
    assert response.json["thread"]["id"] > 0

def test_create_thread_invalid_data(test_client):
    """
    Testa att skapa en tråd med ogiltig data.
    """
    response = test_client.post("/forum/threads", json={"title": "Only Title"})
    assert response.status_code == 400
    assert "Invalid input" in response.json["message"]