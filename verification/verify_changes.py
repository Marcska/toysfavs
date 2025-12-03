
from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Open local index.html file directly
        page.goto('file:///app/index.html')

        # Take screenshot of Hero Section
        page.locator('.hero').screenshot(path='verification/hero.png')

        # Take screenshot of Benefits Section
        page.locator('.benefits').screenshot(path='verification/benefits.png')

        # Take screenshot of Footer
        page.locator('.footer').screenshot(path='verification/footer.png')

        browser.close()

if __name__ == '__main__':
    verify_changes()
